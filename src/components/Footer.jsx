const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <center>
        <hr className="my-3 border-0 h-px bg-gradient-to-r from-primary/50 to-accent/40 opacity-60 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-slate-400/80 text-center">
          © {currentYear}{" "}
          <a
            href="https://github.com/MuhammadRafliEriyanto"
            className="hover:underline"
          >
            Dolph1nsss™
          </a>
          . All Rights Reserved.
        </span>
      </center>
    </footer>
  );
};

export default Footer;
