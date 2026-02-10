import React, { useMemo } from "react";
import DesignGallery from "./DesignGallery";

function RecentArchivesSection() {

  return (
    <section className="main_recent-archives container" >
      <h2>최근 아카이브</h2>
      <p>최근 올라온 다양한 디자인을 확인해 보세요</p>
      <DesignGallery />
    </section>
  );
}

export default RecentArchivesSection;
