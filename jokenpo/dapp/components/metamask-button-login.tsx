import { Profile } from './profile'
import { SignIn } from './signin'
import { cookies } from 'next/headers'

export function MetamaskButtonLogin() {
  const isAuthenticated = cookies().has('walletInfos')

  if (!isAuthenticated) {
    return <SignIn />
  }

  return <Profile />
}
