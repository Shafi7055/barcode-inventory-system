export default function PageHeading({ title, description, eyebrow = "Inventory" }) {
  return (
    <header className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="subheading">{description}</p>
    </header>
  );
}
