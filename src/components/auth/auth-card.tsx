"use client"

import { motion } from "framer-motion"
import Link from "next/link"

import { Logo } from "@/components/shared/logo"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function AuthCard({
  titre,
  description,
  children,
  pied,
}: {
  titre: string
  description: string
  children: React.ReactNode
  pied?: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <Card className="border border-border/60 shadow-none ring-0">
          <CardHeader>
            <CardTitle className="text-xl">{titre}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>

        {pied ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">{pied}</p>
        ) : null}
      </motion.div>
    </div>
  )
}
