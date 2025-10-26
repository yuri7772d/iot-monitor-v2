exports.user = 'user'
exports.admin = 'admin'
exports.isUser = (role) => {
   if(role == 'user'){
    return true;
   }
   return false;
}
exports.isAdmin = (role) => {
   if(role == 'admin'){
    return true;
   }
   return false;
}

