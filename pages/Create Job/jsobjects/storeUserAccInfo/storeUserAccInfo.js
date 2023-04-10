export default {
	storeUserAccInfo: async () => {
		await get_user.run();
		if (get_user.data) {
			const getEmail = get_user.data.email;
			await get_userRoleName.run();
			if (get_userRoleName.data) {
				const getRole = get_userRoleName.data[0].role;
				const getName = get_userRoleName.data[0].first_name + ' ' + get_userRoleName.data[0].last_name;
				storeValue("user", { "Email": getEmail,"Role": getRole, "Name": getName }, true);
			} else {
				console.error('get_userRoleName.data is undefined');
			}
		} else {
			console.error('get_user.data is undefined');
		}
	}
}