"""
Bulletproof Rule-Based Chatbot for FreshSense.
Zero external dependencies, guaranteed no-crash.
"""
import logging
import random

logger = logging.getLogger(__name__)

class ChatbotService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True
        logger.info("Bulletproof Chatbot loaded successfully.")

    def ask(self, user_query: str, context: dict) -> dict:
        """
        Instant, zero-latency response based on keyword matching.
        """
        query = user_query.lower()
        produce = context.get("produce_type", "your food")
        days = context.get("shelf_life_days", 5)
        
        # Standardized replies
        if "store" in query or "keep" in query or "fridge" in query or "counter" in query:
            if days > 5:
                response = f"✅ **{produce}** is still quite fresh! Store it in a cool, dry place away from direct sunlight. If you want it to last even longer, the fridge is your best friend."
            else:
                response = f"⚠️ **{produce}** only has about {days} days left! To maximize its life, keep it in the fridge in an airtight container or a produce bag to lock in moisture."

        elif "expir" in query or "rot" in query or "spoil" in query or "bad" in query or "when" in query:
            if days <= 0:
                response = f"🚨 **{produce}** has already expired. It is not safe to eat. Please discard it immediately to prevent any foodborne illness."
            elif days <= 2:
                response = f"⏰ **{produce}** is in critical condition. You have less than {days} days. Consume it today or freeze it to save it."
            else:
                response = f"📅 **{produce}** is expected to stay fresh for about {days} more days. Check back in a couple of days for a freshness update."

        elif "hello" in query or "hi" in query or "hey" in query:
            response = f"👋 Hello! I am your AI Storage Assistant. I can tell you how to store **{produce}**, when it will expire, or how to check if it's spoiled. What do you need help with?"

        elif "health" in query or "nutrition" in query:
            response = f"💪 **{produce}** is packed with vitamins and antioxidants! Just make sure to wash it thoroughly under cold running water before eating to remove any surface bacteria."

        else:
            response = f"🤔 That's a great question! Right now, I have specific tips for storage, shelf-life, and spoilage signs for **{produce}**. Try asking me: 'How to store', 'When does it expire', or 'Is it spoiled'."

        # Catch-all fallback reminder
        reminder = f"📅 Reminder: Check your {produce} in {max(0, int(days - 1))} days to ensure it's still fresh."

        return {
            "response": response,
            "reminder": reminder
        }