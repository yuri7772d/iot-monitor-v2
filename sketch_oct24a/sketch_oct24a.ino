#include <WiFi.h>
#include <WebServer.h>
#include <Preferences.h>
#include <PubSubClient.h>

// --- CONFIG ---
const char* AP_SSID = "ESP32-SETUP";
const char* AP_PASS = "setup1234";
const char* PREF_NAMESPACE = "wifi_creds";
const int CONNECT_TIMEOUT_MS = 15000;
const int BOOT_BUTTON_PIN = 0;

const char* MQTT_SERVER = "10.37.229.34";   // 👈 ใส่ IP ของ Broker (EMQX / Node-RED)
const int   MQTT_PORT = 1883;
const char* MQTT_CLIENT_ID = "esp32-client-01";
const char* MQTT_TOPIC = "test/topic";

WiFiClient espClient;
PubSubClient client(espClient);
WebServer server(80);
Preferences preferences;

bool isFirstSetup = false;
String savedSSID = "";
String savedPASS = "";
unsigned long lastMsg = 0;

// --- ฟังก์ชันที่ประกาศไว้ก่อน ---
void startAPandServer();
void handleRoot();
void handleSave();
void handleStatus();
void clearSavedCreds();
bool tryConnectSTA(const char* ssid, const char* pass);
void reboot();
void mqttReconnect();
void sendMqttData();

// --- SETUP ---
void setup() {
  Serial.begin(115200);
  delay(500);
  pinMode(BOOT_BUTTON_PIN, INPUT_PULLUP);

  reboot();

  preferences.begin(PREF_NAMESPACE, true);
  savedSSID = preferences.getString("ssid", "");
  savedPASS = preferences.getString("pass", "");
  preferences.end();

  if (savedSSID.length() > 0) {
    WiFi.mode(WIFI_AP_STA);
    WiFi.begin(savedSSID.c_str(), savedPASS.c_str());
    Serial.println("Trying to connect to saved Wi-Fi...");

    if (tryConnectSTA(savedSSID.c_str(), savedPASS.c_str())) {
      Serial.printf("Connected as STA. IP: %s\n", WiFi.localIP().toString().c_str());
      WiFi.mode(WIFI_STA);
      isFirstSetup = true;

      client.setServer(MQTT_SERVER, MQTT_PORT);
      return;
    }
  }

  startAPandServer();
}

// --- LOOP ---
void loop() {
  server.handleClient();

  if (WiFi.status() == WL_CONNECTED && isFirstSetup) {
    if (!client.connected()) mqttReconnect();
    client.loop();

    unsigned long now = millis();
    if (now - lastMsg > 5000) {  // ส่งทุกๆ 5 วินาที
      lastMsg = now;
      sendMqttData();
    }
  } else if (WiFi.status() != WL_CONNECTED && isFirstSetup) {
    Serial.println("WiFi lost. Reconnecting...");
    WiFi.disconnect();
    WiFi.reconnect();
    if (tryConnectSTA(savedSSID.c_str(), savedPASS.c_str())) {
      Serial.println("WiFi reconnected.");
    }
  }
}

// --- MQTT FUNCTION ---
void mqttReconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(MQTT_CLIENT_ID)) {
      Serial.println("connected!");
      client.subscribe("esp32/cmd");  // ตัวอย่าง topic รับคำสั่ง
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void sendMqttData() {
  float temp = random(250, 350) / 10.0; // อุณหภูมิจำลอง
  String payload = "{\"id\":\"esp32-01\",\"temp\":" + String(temp, 1) + "}";
  Serial.println("Publishing: " + payload);
  client.publish(MQTT_TOPIC, payload.c_str());
}

// --- Wi-Fi Setup functions ---
void reboot() {
  if (digitalRead(BOOT_BUTTON_PIN) == LOW) {
    Serial.println("Hold button to clear creds...");
    unsigned long t0 = millis();
    while (millis() - t0 < 3000) {
      if (digitalRead(BOOT_BUTTON_PIN) == HIGH) return;
      delay(20);
    }
    clearSavedCreds();
  }
}

bool tryConnectSTA(const char* ssid, const char* pass) {
  unsigned long start = millis();
  while (millis() - start < CONNECT_TIMEOUT_MS) {
    if (WiFi.status() == WL_CONNECTED) return true;
    delay(200);
  }
  return (WiFi.status() == WL_CONNECTED);
}

void startAPandServer() {
  Serial.printf("Starting AP '%s' ...\n", AP_SSID);
  WiFi.mode(WIFI_AP_STA);
  WiFi.softAP(AP_SSID, AP_PASS);
  IPAddress apIP = WiFi.softAPIP();
  Serial.printf("AP started. IP: %s\n", apIP.toString().c_str());

  server.on("/", HTTP_GET, handleRoot);
  server.on("/save", HTTP_POST, handleSave);
  server.on("/status", HTTP_GET, handleStatus);
  server.begin();
  Serial.println("Web server started on /");
}

String scanNetworksAsOptions() {
  String html = "";
  int n = WiFi.scanNetworks();
  for (int i = 0; i < n; ++i) {
    html += "<option value=\"" + WiFi.SSID(i) + "\">" + WiFi.SSID(i) + " (" + String(WiFi.RSSI(i)) + " dBm)</option>";
  }
  return html;
}

void handleRoot() {
  String page = "<!doctype html><html><body><h2>ESP32 WiFi Setup</h2><form method='POST' action='/save'>";
  page += "<label>SSID:</label><input list='ssid-list' name='ssid' required><datalist id='ssid-list'>";
  page += scanNetworksAsOptions();
  page += "</datalist><br>Password:<input type='password' name='pass'><br><button type='submit'>Save & Connect</button></form>";
  page += "<p><a href='/status'>Status</a></p></body></html>";
  server.send(200, "text/html", page);
}

void handleSave() {
  String ssid = server.arg("ssid");
  String pass = server.arg("pass");

  preferences.begin(PREF_NAMESPACE, false);
  preferences.putString("ssid", ssid);
  preferences.putString("pass", pass);
  preferences.end();

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid.c_str(), pass.c_str());
  Serial.printf("Connecting to %s ...\n", ssid.c_str());

  if (tryConnectSTA(ssid.c_str(), pass.c_str())) {
    Serial.printf("Connected! IP: %s\n", WiFi.localIP().toString().c_str());
    WiFi.softAPdisconnect(true);
    client.setServer(MQTT_SERVER, MQTT_PORT);
    isFirstSetup = true;
  } else {
    Serial.println("Failed to connect with provided credentials.");
  }

  server.send(200, "text/plain", "Saved! Try reconnecting now.");
}

void handleStatus() {
  String s = "<html><body><h2>Status</h2><p>STA IP: " + WiFi.localIP().toString() + "</p></body></html>";
  server.send(200, "text/html", s);
}

void clearSavedCreds() {
  preferences.begin(PREF_NAMESPACE, false);
  preferences.remove("ssid");
  preferences.remove("pass");
  preferences.end();
  Serial.println("Saved credentials cleared.");
}
