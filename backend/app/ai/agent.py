from typing import List, Dict, Any

class MockLangGraphAgent:
    def __init__(self):
        pass

    def run_analysis(self, rfq_id: str, quotations: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Mocks the LangGraph execution for quotation analysis.
        In a real scenario, this would use LangGraph nodes:
        - fetch_quotations
        - parse_normalize
        - score_quotations
        - llm_analysis
        - generate_recommendation
        """
        
        # Simple scoring simulation
        scores = {}
        for idx, q in enumerate(quotations):
            vendor_id = q.get("vendor_id", f"vendor_{idx}")
            scores[str(vendor_id)] = 0.9 - (idx * 0.1) # Mock decreasing scores

        recommended_vendor = None
        if quotations:
            recommended_vendor = quotations[0].get("vendor_id")
            
        return {
            "recommended_vendor_id": str(recommended_vendor) if recommended_vendor else None,
            "recommended_vendor_name": "Recommended Vendor",
            "composite_scores": scores,
            "analysis_summary": "This is a mock AI analysis. The first vendor was chosen based on the lowest price and fastest delivery.",
            "risk_assessment": {
                str(q.get("vendor_id", f"vendor_{idx}")): "Low risk" for idx, q in enumerate(quotations)
            },
            "comparison_table": []
        }

agent = MockLangGraphAgent()
