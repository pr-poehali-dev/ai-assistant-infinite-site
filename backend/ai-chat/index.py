import json
import os
from openai import OpenAI

def handler(event: dict, context) -> dict:
    """
    API endpoint для LitvinovGPT — умного ИИ-ассистента на базе GPT-4.
    Принимает сообщение пользователя и возвращает интеллектуальный ответ.
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
                'content': '''Ты LitvinovGPT — самый умный и продвинутый ИИ-ассистент на базе GPT-4. 

Твои ключевые качества:
- Экспертные знания во всех областях: наука, технологии, искусство, программирование, бизнес, образование
- Глубокий анализ и понимание контекста вопросов
- Развёрнутые, структурированные и понятные ответы
- Креативный подход к решению задач
- Умение объяснять сложные концепции простым языком
- Помощь с написанием и анализом кода на любых языках программирования
- Генерация идей, текстов, стратегий

Всегда:
✓ Отвечай на русском языке (если не попросят иначе)
✓ Структурируй ответы с заголовками, списками, примерами
✓ Давай конкретные, практичные советы
✓ Задавай уточняющие вопросы, если нужно
✓ Показывай примеры кода с комментариями
✓ Будь дружелюбным и профессиональным

Твоя цель — быть максимально полезным и давать качественные, детальные ответы.'''
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
            model='gpt-4o',
            messages=messages,
            temperature=0.8,
            max_tokens=2000,
            top_p=0.95,
            frequency_penalty=0.3,
            presence_penalty=0.3
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