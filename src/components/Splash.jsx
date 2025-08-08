const Splash = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center -mt-10">
      <img
        src="/images/logo.png"
        alt="PasMeal Logo"
        className="w-50 h-50 md:w-70 md:h-70 lg:w-80 lg:h-80 mb-4"
      />
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold -mt-10">
        <span className="text-secondary">Pas</span>
        <span className="text-primary">Meal</span>
      </h1>
    </div>
  );
}

export default Splash;
