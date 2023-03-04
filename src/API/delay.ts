// provides an artificial delay in your range
const artificialDelay = (max: number, min: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default artificialDelay
