import { pipeline, FeatureExtractionPipeline } from '@xenova/transformers';

let embedderPromise: Promise<FeatureExtractionPipeline> | null = null;

export const loadEmbedder = async () => {
  if (!embedderPromise) {
    embedderPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return await embedderPromise;
};

export const getEmbedding = async (text: string): Promise<number[]> => {
  const model = await loadEmbedder();
  const output = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
};
