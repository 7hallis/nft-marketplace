import { createFileRoute } from "@tanstack/react-router";
import NFTDetailsPage from "@/pages/NFTDetailsPage";

export const Route = createFileRoute()({
  component: NFTRoute,
});

function NFTRoute() {
  <NFTDetailsPage/>;
}