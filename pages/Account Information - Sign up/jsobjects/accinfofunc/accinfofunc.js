export default {
	updateUserInfo:async()=>{
		if(appsmith.store.user.Email && appsmith.store.user.Name && appsmith.store.user.Role){
			await get_userRoleName.run();
			if(get_userRoleName.data){
				const userObj = appsmith.store.user;
				userObj.Role = get_userRoleName.data[0].role;
				userObj.Name = get_userRoleName.data[0].first_name + ' ' + get_userRoleName.data[0].last_name;
			}
			else{
				console.log("The user Role and Names are not available");
			}
		}
		console.log("The user Role and Names are not available");
	},
	getUserUUID: async () => {
		// This is to be run on Page Load
		await get_user.run();
		if (get_user.data) {
			await get_user_uuid.run();
			if (get_user_uuid.data.length>0) {
				const getUUID = get_user_uuid.data[0].user_id;
				const user = appsmith.store.user; // similar to getting the value e.g. getValue("user") <---here user is the key that was used to store values in Feed page
				user.UUID = getUUID; // we added this new property called UUID with the value from getUUID
				storeValue("user", user); //so here we are storing the value into the same user key
			} else {
				console.error('get_user_uuid.data is undefined');
			}
		} else {
			console.error('get_user.data is undefined');
		}
	},
	setImgFileName: async()=>{
		await get_user.run();
		if (get_user.data) {
			var fileName = filepicker_profilepic.files[0].name;
			var fileNameParts = fileName.split('.');

			const email = get_user.data.email;
			// getting the indexes of wherever we encounter '.' or the '@' character
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
			const userObjUpFile = appsmith.store.user;
			userObjUpFile.fileName = fileName;
			storeValue("user",userObjUpFile);
			_.assign(filepicker_profilepic.files[0],{name:fileName});
		} else {
			console.error('get_user.data is undefined');
		}
	},
	setResumeFileName: async()=>{
		await get_user.run();
		if (get_user.data) {
			var fileNameResume = filepicker_resume_submission.files[0].name;
			var fileNameResumeParts = fileNameResume.split('.');

			const email = get_user.data.email;
			// getting the indexes of wherever we encounter '.' or the '@' character
			const indexOfDot = email.indexOf('.');
			const indexOfAt = email.indexOf('@');
			if ((indexOfAt<indexOfDot)||(indexOfDot == -1)){
				let imagePrefix = email.substring(0,indexOfAt);
				fileNameResume = imagePrefix+'.'+fileNameResumeParts[1];
			}
			else if(indexOfAt>indexOfDot){
					let emailSplit = email.split('@');
					let emailNoDom = emailSplit[0];
					emailNoDom = emailNoDom.replace(/\./g, '_');
					emailNoDom = emailNoDom.replace(/ /g, '_');
					fileNameResume = emailNoDom+'.'+fileNameResumeParts[1];
			}
			else{
					console.log('File name of image does not contain a period character');
			}
			const userObjUpFile = appsmith.store.user;
			userObjUpFile.fileNameResume = fileNameResume;
			storeValue("user",userObjUpFile);
			_.assign(filepicker_resume_submission.files[0],{name:fileNameResume});
		} else {
			console.error('get_user.data is undefined');
		}
	},
	getImgNameAndImg: async()=>{
		// logic to create the exact filename as made in posting the image we are supposed to have if a user is re-entering the application - one who already had all fields updated
		// This function should run on API load
		// This function should be run to retrieve the images
		const userObj = appsmith.store.user;
		var fileNameExtensions = ['png','jpg','jpeg'];
		var imageNamePre;
		var fileName;
		await get_user.run();
		if (get_user.data) {
			const email = get_user.data.email;
			const indexOfDot = email.indexOf('.');
			const indexOfAt = email.indexOf('@');
			if ((indexOfAt<indexOfDot)||(indexOfDot == -1)){
				imageNamePre = email.substring(0,indexOfAt);
			}
			else if(indexOfAt>indexOfDot){
				let emailSplit = email.split('@');
				imageNamePre = emailSplit[0];
				imageNamePre = imageNamePre.replace(/\./g, '_');
				imageNamePre = imageNamePre.replace(/ /g, '_');
			}
			for(let i=0; i<fileNameExtensions.length; i++){
				try{
					fileName = imageNamePre + '.' + fileNameExtensions[i];
					userObj.fileName = fileName;
					storeValue("user", userObj);
					const response = await get_images.run();
					// console.log(response);
					console.log(response.data);
					if (typeof(response)!=='undefined') {
						userObj.fileName = fileName;
          	storeValue("user", userObj);
						console.log("Successfully saved the fileName");
          	break;
					}
				} catch (error){
					console.error('Error occurred');
					continue;
				}
			}
		}
	}
}