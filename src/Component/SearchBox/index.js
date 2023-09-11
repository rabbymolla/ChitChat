import React from "react";
import "./style.css";
import { BsSearch } from "react-icons/bs";
import { HiDotsVertical } from "react-icons/hi";

const Search = () => {
  return (
    <div>
      <section>
        <div className="main_search_box">
          <div className="seacrh_icon">
            <BsSearch />
          </div>
          <div className="seacrh_input">
            <input type="text" placeholder="Search" />
          </div>
          <div className="seacrh_icon">
            <HiDotsVertical />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Search;
