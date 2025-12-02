const Footer = () => {
  return (
    <footer className="border border-gray-100 bg-card">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row md:py-8">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Marizu Inc. All rights reserved.
        </p> 
        <p className="text-sm text-muted-foreground px-10">
          Managing your e-commerce platform
        </p>
      </div>
    </footer>
  );
};

export default Footer;
