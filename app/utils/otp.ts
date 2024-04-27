
const genOtp = (length = 4) => {
    let otp = ''
    const symbol = 'ahsdvsuy21egbi1y29s1p92e0e84n6233A139m3'
    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * symbol.length)
        otp += symbol[index]
    }
    return otp
}


export default genOtp