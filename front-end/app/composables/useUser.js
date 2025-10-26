

export function useUser() {
    const user = useState('user',()=>null);
     
    async function Login(input) {
        try {
            await $fetch(`${useRuntimeConfig().public.api}/user`,{
                method:'POST',
                body:{
                    username:input.username,
                    password:input.password
                }
            })
        } catch (error) {
            
        }
    }
}
