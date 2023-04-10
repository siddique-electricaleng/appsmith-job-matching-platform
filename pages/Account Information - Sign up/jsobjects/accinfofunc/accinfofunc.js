export default {
	getaccinfo: async () => {
		await get_user.run();
		if (get_user.data) {
			await get_user_uuid.run();
			if (get_user_uuid.data) {
				const getUUID = get_user_uuid.data[0].user_id;
				storeValue("user", {"UserID": getUUID}, true);
			} else {
				console.error('get_user_uuid.data is undefined');
			}
		} else {
			console.error('get_user.data is undefined');
		}
	},
	setImageName: async()=>{
		await get_user.run();
		if (get_user.data) {
			var fileName = filepicker_profilepic.files[0].name;
			const fileNameParts = fileName.split('.');

			const email = get_user.data.email;
			const indexOfDot = email.indexOf('.');
			const indexOfAt = email.indexOf('@');
			
			if ((indexOfAt<indexOfDot)||(indexOfDot == -1)){
				 let imagePrefix = email.substring(0,indexOfAt);
				 fileName = imagePrefix+'.'+fileNameParts[1];
			}
			else if(indexOfAt>indexOfDot){
					let emailSplit = email.split('@');
					let emailNoDom = emailSplit[0];
					emailNoDom = emailNoDom.replace(/\./g, '_');
					emailNoDom = emailNoDom.replace(/ /g, '_');
					fileName = emailNoDom+'.'+fileNameParts[1];
			}
			else{
					console.log('File name of image does not contain a period character');
			}
			storeValue('profilePicName',fileName);
			_.assign(filepicker_profilepic.files[0],{name:fileName});
		} else {
			console.error('get_user.data is undefined');
		}
	}
}