// turned off, cause appears some async in a user interface
// import artificialDelay from './delay'

// fake API call.
const fakeAuthProvider = {
  isAuthenticated: false,

  signin(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = true
    setTimeout(callback, 1000) // fake backend async
  },

  signout(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = false
    setTimeout(callback, 1000) // fake backend async
    setTimeout(() => {
      localStorage.clear()
    }, 1000)
  },
}

export { fakeAuthProvider }
