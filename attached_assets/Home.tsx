import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import AddressBar from "../components/AddressBar";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import SpecialOffers from "../components/SpecialOffers";
import NearbyClinicsList from "../components/NearbyClinicsList";
import PopularProfessionalsList from "../components/PopularProfessionalsList";
import LoginModal from "../components/LoginModal";
import FilterModal from "../components/FilterModal";
import {
  categories,
  specialOffers,
  nearbyClinics,
  popularProfessionals,
} from "../data/mockData";
import { Category } from "../types";

const Home: React.FC = () => {
  const { setShowFilterModal } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategorySelect = (category: Category) => {
    setShowFilterModal(true);
  };

  return (
    <div id="homeScreen" className="pb-4">
      <AddressBar />
      <SearchBar onSearch={handleSearch} />
      <CategoryFilter categories={categories} onSelect={handleCategorySelect} />
      <SpecialOffers offers={specialOffers} />
      <NearbyClinicsList clinics={nearbyClinics} />
      <PopularProfessionalsList professionals={popularProfessionals} />

      <LoginModal />
      <FilterModal />
    </div>
  );
};

export default Home;
