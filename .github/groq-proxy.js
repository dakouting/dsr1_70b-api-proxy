export default {
  async fetch(request, env) {
    const TARGET_BASE_URL = 'https://api.groq.com/openai'; // Groq API 地址
    const GROQ_API_KEY = request.headers.get('Authorization'); // 从请求头获取用户API Key

    // 检查API Key是否存在
    if (!GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: 'API Key is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 解析请求路径
    const url = new URL(request.url);
    const targetPath = url.pathname; // 保留原始路径（如 /v1/chat/completions）

    // 构建新请求
    const newRequest = new Request(`${TARGET_BASE_URL}${targetPath}`, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': GROQ_API_KEY // 使用用户提供的API Key
      },
      body: request.body
    });

    try {
      const response = await fetch(newRequest);
      return new Response(response.body, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*', // 允许跨域
          'Content-Type': 'application/json'
        }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }
};
