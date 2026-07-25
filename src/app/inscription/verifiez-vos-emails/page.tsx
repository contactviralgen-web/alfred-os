import Image from "next/image"

export default function VerifiezVosEmailsPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-sm flex-col items-center gap-3 text-center">
        <Image
          src="/logo-wordmark.png"
          alt="Profytt"
          width={220}
          height={40}
          className="h-9 w-auto"
        />
        <h1 className="text-xl font-semibold tracking-tight">
          Vérifiez votre boîte mail
        </h1>
        <p className="text-sm text-muted-foreground">
          Nous vous avons envoyé un lien de confirmation. Cliquez dessus pour
          activer votre compte Profytt.
        </p>
      </div>
    </div>
  )
}
