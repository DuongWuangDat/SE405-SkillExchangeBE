require("dotenv").config();

/**
 * Phát hiện nội dung toxic trong tin nhắn Tiếng Việt
 * Sử dụng keyword-based detection (nhanh và hiệu quả)
 */

/**
 * Keyword-based toxic content detection for Vietnamese
 * Chỉ giữ các từ toxic RÕ RÀNG, tránh false positive
 * @param {string} text - Message text to check
 * @returns {Promise<{isToxic: boolean, score: number, label: string}>}
 */
const checkToxicityKeywords = async (text) => {
    // Chỉ giữ các từ toxic RÕ RÀNG, bỏ từ ngắn dễ nhầm
    const toxicKeywords = [
        // Từ tục tĩu thô tục (chỉ giữ từ rõ ràng)
        "đụ", "địt", "lồn", "buồi", "cặc", "đéo", "vcl", "vkl", 
        "clgt", "clmm", "cứt", "đít", "loz", "lòz", "đĩ",
        
        // Chửi bố mẹ (cụm từ đầy đủ)
        "dmm", "đmm", "dcm", "đcm", "dcmm", "đcmm", "ngu", "dm", "vl",
        "mẹ mày", "bố mày", "cha mày", "con mẹ", "con má", 
        "đéo mẹ", "đụ má", "đjt", "djt",
        
        // Xúc phạm nhân phẩm (cụm từ đầy đủ)
        "đồ chó", "thằng chó", "con chó", "đồ ngu", "thằng ngu", "con ngu",
        "ngu như chó", "ngu si", "óc chó", "não chó", "đồ khốn",
        "đồ súc sinh", "súc vật", "đồ mất dạy", "đồ rác", "thằng rác",
        
        // Gái điếm (cụm từ đầy đủ)
        "gái điếm", "con điếm", "đồ điếm", "mại dâm",
        
        // Chết chóc (cụm từ đầy đủ)
        "chết đi", "chết mẹ", "đi chết", "chết tiệt",
        
        // Ăn cứt
        "ăn cứt", "ăn shit",
        
        // Từ viết tắt toxic rõ ràng
        "vcl", "vkl", "clmm", "clgt", "đkm", "dkm", "cmnr",
        
        // Tiếng Anh toxic rõ ràng (bỏ các từ ngắn dễ nhầm)
        "fuck", "shit", "bitch", "asshole", "bastard",
        "motherfucker", "son of a bitch"
    ];

    const lowerText = text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    
    // Check với WORD BOUNDARY nghiêm ngặt (whole word only)
    const foundKeywords = toxicKeywords.filter(keyword => {
        const normalizedKeyword = keyword.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        
        // Chỉ match WHOLE WORD, không match substring
        const regex = new RegExp(`\\b${normalizedKeyword}\\b`, 'i');
        return regex.test(lowerText);
    });

    const isToxic = foundKeywords.length > 0;

    return {
        isToxic: isToxic,
        score: isToxic ? 0.9 : 0.1,
        label: isToxic ? "toxic" : "clean",
        matchedKeywords: foundKeywords,
        method: "keywords"
    };
};

/**
 * Main function to check message toxicity
 * Uses keyword-based detection only (fast and reliable)
 */
const detectToxicity = async (text) => {
    try {
        if (!text || text.trim().length === 0) {
            return { isToxic: false, score: 0, label: "clean" };
        }
        
        // Use keyword-based detection
        return await checkToxicityKeywords(text);
        
    } catch (error) {
        console.error("Error in toxicity detection:", error);
        // Default to allowing message if detection fails
        return {
            isToxic: false,
            score: 0,
            label: "unknown",
            error: error.message
        };
    }
};

module.exports = {
    detectToxicity,
    checkToxicityKeywords
};
