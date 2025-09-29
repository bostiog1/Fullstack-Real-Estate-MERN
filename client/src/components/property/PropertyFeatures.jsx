import "./PropertyFeatures.scss";

function PropertyFeatures({ utilities, pet, income }) {
  const features = [
    {
      icon: "/utility.png",
      title: "Utilități",
      description:
        utilities === "owner"
          ? "Proprietarul este responsabil"
          : "Locatarul este responsabil",
    },
    {
      icon: "/pet.png",
      title: "Politica privind animalele",
      description:
        pet === "allowed"
          ? "Animale de companie permise"
          : "Animalele de companie nu sunt permise",
    },
  ];

  if (income) {
    features.push({
      icon: "/income.png",
      title: "Cerințe venit",
      description: income,
    });
  }

  return (
    <div className="property-features">
      <h3>Caracteristici</h3>
      <div className="features-list">
        {features.map((feature, index) => (
          <div key={index} className="feature-item">
            <div className="feature-icon">
              <img src={feature.icon} alt={feature.title} />
            </div>
            <div className="feature-content">
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PropertyFeatures;
