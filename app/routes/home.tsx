import type { Route } from "./+types/home";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import logo from "/logo.png";
import { Link } from "react-router";
import { Box, Newspaper } from "lucide-react"
import BG from "@/components/layout/bg";
import { delay, motion } from "motion/react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Requests" },
    { name: "description", content: "Welcome to SAM requests" },
  ];
}

export default function Home() {

  const bouncingUpAnimation = {
    initial: { y: 30, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    transition: {
      duration: 0.3,
      delay: 0.3,
      type: "spring" as const,
      stiffness: 200
    }
  }
  return (
    <>

      <main className="flex flex-col items-center justify-center pt-16 pb-4">

        <section className="flex-1 flex flex-col justify-center items-center gap-9 ">
          <header className="flex flex-col items-center gap-9">
            <div className="w-[200px] max-w-[900vw] p-4">
              <img
                src={logo}
                alt="Treetech"
                className="block w-full"
              />
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl px-4">
            <motion.div
              initial={bouncingUpAnimation.initial}
              whileInView={bouncingUpAnimation.whileInView}
              transition={bouncingUpAnimation.transition}
            >
              <Link to="/request">
                <Card className="bg-background/70 flex flex-col items-center justify-center p-6 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-col items-center">
                    <Newspaper className="size-12 mb-4 text-zinc-800" />
                    <CardTitle>Requisição</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-zinc-600">
                      Monte uma nova requisição de aplicação para a linha SD.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={bouncingUpAnimation.initial}
              whileInView={bouncingUpAnimation.whileInView}
              transition={{ ...bouncingUpAnimation.transition, delay: 0.4 }}
            >
              <Link to="/new-ied">
                <Card className="bg-background/70 flex flex-col items-center justify-center p-6 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-col items-center">
                    <Box className="size-12 mb-4 text-zinc-800" />
                    <CardTitle>Homologação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-zinc-600">
                      Faça um novo pedido para homologação de um novo IED ainda não disponível.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>

        </section>
      </main>
      <BG />
    </>
  )
}
