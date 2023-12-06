"""
Iterate through a list of questions and generate multiple answers for different system settings (E.g., k variable in FAISS).

python generate_answers_for_evaluation.py <filename>

where filename is a text file containing one question per line.

Results are added to supabase as specified in either 
SUPABASE_URL_PRODUCTION/SUPABASE_SERVICE_KEY_PRODUCTION
or
SUPABASE_URL_STAGING/SUPABASE_SERVICE_KEY_STAGING
"""
import json
import os
import requests
from supabase import create_client
import sys
from tqdm import tqdm
import uuid
input_csv = sys.argv[1]

# point to getanswer server
api_endpoint = "http://localhost:8080"


def make_api_call(title, response_type, k):
    card_id = str(uuid.uuid4())
    # create empty card first
    response = supabase.table('cards').insert({'id': card_id, 'title': title, 'card_type': 'for_evaluation'}).execute()
    payload = {"query": title, "response_type": response_type, "k": k, "card_id": card_id}
    try:
        response = requests.post(f"{api_endpoint}", json=payload)
    except Exception as e:
        print(e)
    return

# Setup Supabase client
try:
    supabase_url = os.environ["SUPABASE_URL_PRODUCTION"]
    supabase_key = os.environ["SUPABASE_SERVICE_KEY_PRODUCTION"]
except KeyError:
    supabase_url = os.environ.get("SUPABASE_URL_STAGING")
    supabase_key = os.environ.get("SUPABASE_SERVICE_KEY_STAGING")

if not supabase_url or not supabase_key:
    raise ValueError("Supabase URL and key must be set in environment variables")

supabase = create_client(supabase_url, supabase_key)
questions = [t.strip() for t in open(input_csv).readlines()]
for qi, question in enumerate(questions):
    question = question.strip()
    print('(%d/%d): %s' % (qi+1, len(questions), question))
    for k in [10, 15, 20]:
        print("Generating response for k=%d..." % k)
        make_api_call(question, response_type='in_depth', k=k)
