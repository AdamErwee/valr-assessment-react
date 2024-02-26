"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import getLatestBlocks from "../../../api/get-latest-blocks";
import Table from "../../../components/latest-blocks-table";
import BitcoinHashSearch from "../../../components/search";
import { CHAINS } from "../../../constants/chains";
import { TableContainer } from "../../../styles/block-explorer-layout.styles";
import { LatestBlockData } from "../../../types";

const LatestBlocks = () => {
  const [latestBlocks, setLatestBlocks] = useState<LatestBlockData[]>([]);

  const pathname = usePathname();
  const params = useSearchParams();
  const searchParam = params.get("search");
  const activeChain = CHAINS.find(({ symbol }) => pathname.includes(symbol));

  useEffect(() => {
    const fetchLatestBlocks = async () => {
      if (activeChain) {
        try {
          const { apiReference, searchable } = activeChain;
          const searchQuery = searchable && searchParam ? searchParam : "";

          const blocks = await getLatestBlocks({
            chain: apiReference,
            searchParam: searchQuery,
          });

          setLatestBlocks(blocks);
        } catch (error) {
          console.error("Error fetching latest blocks:", error);
          setLatestBlocks([]); // Reset blocks in case of error // TODO:
        }
      }
    };

    fetchLatestBlocks();
  }, [pathname, searchParam]);

  return (
    <TableContainer>
      {activeChain?.searchable && <BitcoinHashSearch />}
      <h2>Latest Blocks</h2>
      <Table data={latestBlocks} isLoading={latestBlocks.length === 0} />
    </TableContainer>
  );
};

export default LatestBlocks;
