// userData.js
const userData = JSON.parse(localStorage.getItem("userData")) || {
    isAuthenticated: false,
    userdetail: null,
};

const getUserData = () => userData;

const updateUserData = (newData) => {
    Object.assign(userData, newData);
    localStorage.setItem("userData", JSON.stringify(userData));
};

const clearUserData = () => {
    Object.assign(userData, { isAuthenticated: false, userdetail: null });
    localStorage.removeItem("userData");
};

export { getUserData, updateUserData, clearUserData };
