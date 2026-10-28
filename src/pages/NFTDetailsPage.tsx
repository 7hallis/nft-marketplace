import { useNavigate, useParams } from "@tanstack/react-router";

import NFTDetails from "@/components/nft/NFTDetails";
import { useCart } from "@/contexts/CartContext";
import { nfts } from "@/data/nfts";

export default function NFTDetailsPage() {
  const navigate = useNavigate();

  const { nftId } = useParams({
    from: "/nft/$nftId",
  });

  const { addToCart } = useCart();

 const normalizeId = (id: string) =>
  String(id).replace("#", "").trim().replace(/^0+/, "") || "0";

  const selectedNft = nfts.find(
    (item) => normalizeId(item.id) === normalizeId(nftId)
  );

  if (!selectedNft) {
    return (
      <main className="mx-auto max-w-3xl p-8 text-center text-white">
        <h1 className="text-2xl font-bold">
          NFT não encontrado
        </h1>

        <p className="mt-2 text-white/60">
          Não encontramos um NFT com o identificador: {nftId}
        </p>

        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="mt-4 rounded-full bg-[#D98845] px-5 py-2 font-semibold text-black"
        >
          Voltar para a página inicial
        </button>
      </main>
    );
}

  const handleComprar = (quantity: number) => {
    addToCart({
      image: selectedNft.image,
      name: selectedNft.name,
      id: selectedNft.id,
      price: Number(selectedNft.price),
      quantity,
      alt: selectedNft.alt,
    });

    navigate({ to: "/carrinho" });
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <NFTDetails
        nft={selectedNft}
        onComprar={handleComprar}
      />
    </main>
  );
}
