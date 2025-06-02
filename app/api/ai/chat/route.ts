import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/ai-models/ai-service'

/**
 * API route cho chatbot hỗ trợ khách hàng
 * POST /api/ai/chat - Xử lý câu hỏi của khách hàng
 */
export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json()
    
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Câu hỏi không hợp lệ' },
        { status: 400 }
      )
    }

    // Sử dụng AI service để trả lời câu hỏi
    const answer = await aiService.answerCustomerQuestion(question)
    
    return NextResponse.json({ answer })
    
  } catch (error) {
    console.error('Lỗi API chat:', error)
    return NextResponse.json(
      { error: 'Lỗi khi xử lý yêu cầu' },
      { status: 500 }
    )
  }
}

// Tùy chọn: Xử lý các phương thức khác
export async function GET() {
  return NextResponse.json(
    { error: 'Phương thức không được hỗ trợ' },
    { status: 405 }
  )
}
