import Header from "@/components/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { useState } from "react";

import { Footer } from "@/components/footer";

import FormChekout from "@/components/FormCheckout";

export default function Carrinho() {
  const [search, setSearch] = useState("");
  return (
    <main className="min-h-screen bg-[#110B08] font-mono text-[#E8D9CE]">
      <div className="mx-auto max-w-6xl px-4 py-6">
      <Header  search={search} setSearch={setSearch}/>
        <Breadcrumb className="mb-3 mt-3 text-sm text-[#B39463]">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<a href="/home" />}>Início</BreadcrumbLink>
            </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink render={<a href="/mercado" />}>Mercado</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Checkout</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div >
       {/* Charrinho de compras */}
            <FormChekout/>  
        </div>
      <Footer/>
      </div>
    </main>
  );
}