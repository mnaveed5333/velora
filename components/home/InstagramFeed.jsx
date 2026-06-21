import SocialLinks from "@/components/layout/SocialLinks";

const images = [
  "/footer-img-01.jpg",
  "/footer-img-02.jpg",
  "/footer-img-03.jpg",
  "/footer-img-04.jpg",
];

export default function InstagramFeed() {
  return (
    <section className="px-4 py-10 sm:px-6 md:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {images.map((img) => (
          // IMAGE: {img}
          <img
            key={img}
            src={img}
            alt=""
            className="aspect-[3/4] w-full rounded-xl object-cover sm:rounded-2xl"
          />
        ))}
      </div>
      <div className="mt-6 sm:mt-8">
        <SocialLinks />
      </div>
    </section>
  );
}