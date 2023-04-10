export default {
	signIn: () =>{
		return sign_in_API.run()
		.then(data =>{
			delete data.user;
			Object.keys(data).forEach(i=>{
				storeValue(i,data[i]);
			});
		})
		.then(() =>{
			const userTok = sign_in_API?.data?.access_token;
			if (userTok){
				storeValue('access_token',userTok);
				navigateTo('Feed');
			}else{
				showAlert('Login Failed!','error');
			}
		});
	},
	continue: async() =>{
		if(!appsmith.URL.fullPath.includes('#access_token')) return;
		appsmith.URL.fullPath.split('#')[1].split('&').forEach(i=>{
			const [key, value] = i.split('=');
			storeValue(key,value);
		});
		navigateTo('Feed');
	}
}