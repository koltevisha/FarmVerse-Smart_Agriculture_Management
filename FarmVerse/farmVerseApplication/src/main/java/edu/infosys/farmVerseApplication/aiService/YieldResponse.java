package edu.infosys.farmVerseApplication.aiService;

public class YieldResponse {
   private String generatedText;
   
   public YieldResponse() {}
   
   public YieldResponse(String generatedText) {
	   this.generatedText=generatedText;
   }   
   public  String getGeneratedText() {
	   return generatedText;
   }
   public void setGeneratedText(String generatedText) {
	   this.generatedText=generatedText;
   }
}
