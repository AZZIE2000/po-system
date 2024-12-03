### semantic

Percentile
The default way to split is based on percentile. In this method, all differences between sentences are calculated, and then any difference greater than the X percentile is split.

Standard Deviation
In this method, any difference greater than X standard deviations is split.

Interquartile
In this method, the interquartile distance is used to split chunks.

Gradient
In this method, the gradient of distance is used to split chunks along with the percentile method. This method is useful when chunks are highly correlated with each other or specific to a domain e.g. legal or medical. The idea is to apply anomaly detection on gradient array so that the distribution become wider and easy to identify boundaries in highly semantic data.

```json
{
  "chunking_strategy": "semantic",
  "breakpoint_threshold_type": [
    "percentile", // default
    "standard_deviation",
    "interquartile",
    "gradient"
  ]
}
```

### Character-based Splitting

Splits text into chunks based on a specified number of characters.
Useful for consistent chunk sizes regardless of content structure.

```json
{
  "chunking_strategy": "CharacterTextSplitter",
  "chunk_size": 1000,
  "chunk_overlap": 200,
  "separator": "\n\n"
}
```

### RecursiveCharacterTextSplitter

refrences:
https://python.langchain.com/docs/how_to/recursive_text_splitter/

```json
{
  "chunking_strategy": "RecursiveCharacterTextSplitter",
  "chunk_size": 1000,
  "chunk_overlap": 200,
  "separators": null, // e.g: ["\n", "----"]
  "keep_separator": true // || "start" || "end"
}
```

### SentenceTransformersTokenTextSplitter

```json
{
  "chunking_strategy": "SentenceTransformersTokenTextSplitter",
  "chunk_size": 1000, // ? idk how much
  "chunk_overlap": 50, // def in the func docs 50 so its [optional]
  "model_name": "sentence-transformers/all-mpnet-base-v2", // select between the def or, hi its me again couldn't find refs for the model names that we can use :(
  "tokens_per_chunk": null // number + also idk how much
}
```

### TokenTextSplitter

```json
{
  "chunking_strategy": "TokenTextSplitter",
  "chunk_size": 1000,
  "chunk_overlap": 50
}
```
