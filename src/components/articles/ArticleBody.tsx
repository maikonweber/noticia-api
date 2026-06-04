import { splitArticleParagraphs } from "@/lib/articles";

type Props = {
  text: string;
  className?: string;
};

export function ArticleBody({ text, className = "" }: Props) {
  const paragraphs = splitArticleParagraphs(text);

  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={
            index < paragraphs.length - 1
              ? "mb-4 leading-relaxed last:mb-0"
              : "leading-relaxed"
          }
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
