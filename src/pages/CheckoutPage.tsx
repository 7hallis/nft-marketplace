
import Header from "@/components/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useState } from "react";
import { Footer } from "@/components/footer";
import FormChekout from "@/components/FormCheckout";

export default function Carrinho() {
  const [search, setSearch] = useState("");

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#110B08] font-mono text-[#E8D9CE]">
      <div className="mx-auto w-full min-w-0 max-w-6xl px-0 py-0 sm:px-4 sm:py-6 lg:px-8">

        {/* Header: somente desktop */}
        <div className="hidden lg:block">
          <Header search={search} setSearch={setSearch} />
        </div>

        {/* Breadcrumb: somente desktop */}
        <div className="hidden lg:block">
          <Breadcrumb className="mb-3 mt-3 text-sm text-[#B39463]">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<a href="/home" />}>
                  Início
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator>/</BreadcrumbSeparator>

              <BreadcrumbItem>
                <BreadcrumbLink render={<a href="/mercado" />}>
                  Mercado
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator>/</BreadcrumbSeparator>

              <BreadcrumbItem>
                <BreadcrumbPage>Checkout</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Checkout: visível no mobile e desktop */}
        <section className="min-w-0 w-full">
          <FormChekout />
        </section>

        {/* Footer: somente desktop */}
        <div className="hidden lg:block">
          <Footer />
        </div>

      </div>
    </main>
  );
}
