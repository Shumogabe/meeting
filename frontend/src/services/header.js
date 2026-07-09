function Header() {
  const user = JSON.parse(localStorage.getItem('UserInfo'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
}
export {Header};