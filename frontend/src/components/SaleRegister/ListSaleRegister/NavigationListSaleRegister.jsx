import { useEffect, useState } from "react";

function NavigationListSaleRegister({ contSaleRegisterPages, setListSaleRegistersPage }) {
  const [listPageSelected, setListPageSelected] = useState(1);

  useEffect(() => {
    const selectedPageElement = document.getElementById(
      "pageSaleRegisterList" + listPageSelected
    );

    if (selectedPageElement) {
      selectedPageElement.classList.add("active");

      return () => {
        selectedPageElement.classList.remove("active");
      };
    }
  }, [listPageSelected]);

  const handlePageClick = (page) => {
    setListPageSelected(page); 
    setListSaleRegistersPage(page); 
  };

  const goToNextPage = () => {
    if (listPageSelected < contSaleRegisterPages) {
      handlePageClick(listPageSelected + 1);
    }
  };

  const goToPreviousPage = () => {
    if (listPageSelected > 1) {
      handlePageClick(listPageSelected - 1);
    }
  };

  return (
    <>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          goToPreviousPage();
        }}
      >
        ❮
      </a>

      {Array.from({ length: contSaleRegisterPages }, (_, index) => {
        const pageNum = index + 1;
        return (
          <a
            key={pageNum}
            id={"pageSaleRegisterList" + pageNum}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(pageNum);
            }}
          >
            {pageNum}
          </a>
        );
      })}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          goToNextPage();
        }}
      >
        ❯
      </a>
    </>
  );
}

export default NavigationListSaleRegister;
