import json
import os
from openai import OpenAI

def handler(event: dict, context) -> dict:
    """
    API endpoint для общения с ИИ-ассистентом на базе OpenAI GPT-4.
    Принимает сообщение пользователя и возвращает ответ ИИ.
    """
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        user_message = body.get('message', '').strip()
        chat_history = body.get('history', [])
        
        if not user_message:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Message is required'}),
                'isBase64Encoded': False
            }
        
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'OpenAI API key not configured'}),
                'isBase64Encoded': False
            }
        
        client = OpenAI(api_key=api_key)
        
        messages = [
            {
                'role': 'system',
                'content': 'Ты умный и дружелюбный ИИ-ассистент. Отвечай на русском языке развёрнуто, понятно и полезно. Помогай пользователям с любыми вопросами.'
            }
        ]
        
        for msg in chat_history[-10:]:
            messages.append({
                'role': msg.get('role'),
                'content': msg.get('content')
            })
        
        messages.append({
            'role': 'user',
            'content': user_message
        })
        
        response = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        ai_message = response.choices[0].message.content
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': ai_message,
                'timestamp': context.request_id
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
