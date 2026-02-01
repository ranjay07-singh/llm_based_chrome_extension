Project Overview

This project focuses on logical classification of instructional text (Simple, Mandatory, Sequential, Conditional, Exclusive, and Goal-based) using a fine-tuned Large Language Model and delivering the structured output through a Chrome Extension interface.

Dataset Preparation

The original dataset was available in Excel format.

The dataset was converted into JSON format using Python and Pandas.

Logical labels were assigned during preprocessing.

The conversion and preprocessing code is available in:
Model_Training/excel_to_json.ipynb

The processed JSON datasets are stored in:
Model_Training/Datasets/

Model Training

The base model used for training is LLaMA-3.2 (1B parameters).

Fine-tuning was performed using QLoRA (Quantized Low-Rank Adaptation) for memory-efficient training.

Training was conducted on Kaggle, leveraging the 30 hours/week free GPU quota.

The trained LoRA adapters are saved locally and loaded during inference.

Note: Update dataset paths and LoRA model paths according to your local or cloud directory structure.

Backend & Model Execution

Google Colab is used to run the fine-tuned model for inference.

A Flask API serves the model predictions.

pyngrok is used for tunneling, allowing the Colab-hosted backend to be accessed externally.

The Chrome Extension communicates with the backend through the ngrok public URL.

Important Configuration Steps:

Replace the dataset and model directory paths as per your setup.

Update the ngrok Auth Token with your own token before running the backend.

Frontend (Chrome Extension)

The Chrome Extension source code is located in:
chrome_extension/

It captures user queries and webpage context (if available).

Requests are sent to the backend API.

The structured output is displayed directly within the browser interface.

Key Technologies Used

Python, Pandas

Hugging Face Transformers

LLaMA-3.2 (1B)

LoRA / QLoRA

Kaggle GPU

Google Colab

Flask API

pyngrok

Chrome Extension (JavaScript)

Summary

This system enables users to:

Understand unstructured instructions and policies

Receive logically structured outputs

Access AI-powered assistance directly from the browser

The architecture is lightweight, scalable, and suitable for academic as well as practical demonstrations.