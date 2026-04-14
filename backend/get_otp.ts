import User from '#models/user'

async function getOtp() {
  const user = await User.query().orderBy('id', 'desc').first()
  if (user) {
    console.log(`LATEST_OTP:${user.otpCode} for ${user.mobile}`)
  } else {
    console.log('NO_USER_FOUND')
  }
}

getOtp().then(() => process.exit())
