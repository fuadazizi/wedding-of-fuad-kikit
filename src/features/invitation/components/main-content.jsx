import Hero from "@/features/invitation/components/hero";
import { QuranVerse, CoupleInfo } from "@/features/couple";
import { Events } from "@/features/events";
import { Location } from "@/features/location";
import { Wishes } from "@/features/wishes";
import { Gifts } from "@/features/gifts";

// Main Invitation Content
export default function MainContent() {
  return (
    <>
      <Hero />
      <QuranVerse />
      <CoupleInfo />
      <Events />
      <Location />
      <Gifts />
      <Wishes />
    </>
  );
}

