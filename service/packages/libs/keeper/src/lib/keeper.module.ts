import { Module } from '@nestjs/common';
import MemoryExtractorServiceProvider from "./extract/extractor.service";
import { PersistentModule } from "@saito/persistent";
import { MemoryEthStorage } from "./memory.ethstorage";
import { EthStorageModule } from "@saito/ethstorage";
import MemoryRetrieverServiceProvider from "./retireve/retriever.service";
import MemoryKeeperPipelineProvider from "./memory.pipeline";
import MemoryAuthServiceProvider from "./authorize/auth.service";

@Module({
  imports: [PersistentModule, EthStorageModule],
  providers: [
    MemoryKeeperPipelineProvider,
    MemoryExtractorServiceProvider,
    MemoryAuthServiceProvider,
    MemoryRetrieverServiceProvider,
    MemoryEthStorage],
  exports: [MemoryKeeperPipelineProvider]
})
export class KeeperModule {}
