import { SettingsForm } from '@/components/settings-form'

export default function SettingsPage() {
  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-mono text-2xl font-extrabold sm:text-4xl">
        Settings
      </h1>

      <p className="mb-6 text-sm leading-6 sm:text-lg sm:leading-7">
        Welcome, Admin. Here you can make some changes to the contract&apos;s
        functionality. They are as follows: Change the bet amount for each play
        by the players. Change the commission amount that goes to the house.
        Update the contract with the address of a new version if you have
        deployed one.
      </p>

      <SettingsForm />
    </section>
  )
}
