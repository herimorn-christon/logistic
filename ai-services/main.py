from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import os
from typing import List, Dict, Any
import logging

# Import AI modules
from models.predictive_maintenance import PredictiveMaintenanceModel
from models.route_optimization import RouteOptimizer
from models.demand_forecasting import DemandForecaster
from models.fuel_fraud_detection import FuelFraudDetector
from models.driver_scoring import DriverScoringModel
from models.pricing_engine import DynamicPricingEngine
from models.chatbot import FleetChatbot
from models.computer_vision import CargoVisionModel
from utils.database import DatabaseManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FleetForge AI Services", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI models
db_manager = DatabaseManager()
maintenance_model = PredictiveMaintenanceModel()
route_optimizer = RouteOptimizer()
demand_forecaster = DemandForecaster()
fuel_fraud_detector = FuelFraudDetector()
driver_scorer = DriverScoringModel()
pricing_engine = DynamicPricingEngine()
chatbot = FleetChatbot()
vision_model = CargoVisionModel()

@app.on_event("startup")
async def startup_event():
    """Initialize AI models on startup"""
    logger.info("Loading AI models...")
    try:
        await maintenance_model.load_model()
        await route_optimizer.load_model()
        await demand_forecaster.load_model()
        await fuel_fraud_detector.load_model()
        await driver_scorer.load_model()
        await pricing_engine.load_model()
        await chatbot.load_model()
        await vision_model.load_model()
        logger.info("All AI models loaded successfully")
    except Exception as e:
        logger.error(f"Error loading models: {e}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Predictive Maintenance Endpoints
@app.post("/ai/maintenance/predict")
async def predict_maintenance(vehicle_data: Dict[str, Any]):
    """Predict maintenance needs for a vehicle"""
    try:
        prediction = await maintenance_model.predict(vehicle_data)
        return {
            "vehicle_id": vehicle_data.get("vehicle_id"),
            "breakdown_risk": prediction["breakdown_risk"],
            "maintenance_needed": prediction["maintenance_needed"],
            "next_maintenance_date": prediction["next_maintenance_date"],
            "confidence": prediction["confidence"]
        }
    except Exception as e:
        logger.error(f"Maintenance prediction error: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")

@app.post("/ai/maintenance/batch-predict")
async def batch_predict_maintenance(vehicles_data: List[Dict[str, Any]]):
    """Batch predict maintenance for multiple vehicles"""
    try:
        predictions = []
        for vehicle_data in vehicles_data:
            prediction = await maintenance_model.predict(vehicle_data)
            predictions.append({
                "vehicle_id": vehicle_data.get("vehicle_id"),
                **prediction
            })
        return {"predictions": predictions}
    except Exception as e:
        logger.error(f"Batch maintenance prediction error: {e}")
        raise HTTPException(status_code=500, detail="Batch prediction failed")

# Route Optimization Endpoints
@app.post("/ai/routes/optimize")
async def optimize_route(route_data: Dict[str, Any]):
    """Optimize a delivery route"""
    try:
        optimized_route = await route_optimizer.optimize(route_data)
        return {
            "original_distance": route_data.get("distance"),
            "optimized_distance": optimized_route["distance"],
            "time_saved": optimized_route["time_saved"],
            "fuel_saved": optimized_route["fuel_saved"],
            "waypoints": optimized_route["waypoints"],
            "traffic_prediction": optimized_route["traffic_prediction"]
        }
    except Exception as e:
        logger.error(f"Route optimization error: {e}")
        raise HTTPException(status_code=500, detail="Route optimization failed")

@app.post("/ai/routes/multi-optimize")
async def optimize_multiple_routes(routes_data: List[Dict[str, Any]]):
    """Optimize multiple routes simultaneously"""
    try:
        optimized_routes = await route_optimizer.optimize_multiple(routes_data)
        return {"optimized_routes": optimized_routes}
    except Exception as e:
        logger.error(f"Multi-route optimization error: {e}")
        raise HTTPException(status_code=500, detail="Multi-route optimization failed")

# Demand Forecasting Endpoints
@app.post("/ai/forecasting/demand")
async def forecast_demand(forecast_data: Dict[str, Any]):
    """Forecast delivery demand"""
    try:
        forecast = await demand_forecaster.predict(forecast_data)
        return {
            "forecast_period": forecast_data.get("period", "7_days"),
            "predicted_demand": forecast["demand"],
            "confidence_interval": forecast["confidence_interval"],
            "seasonal_factors": forecast["seasonal_factors"],
            "trend": forecast["trend"]
        }
    except Exception as e:
        logger.error(f"Demand forecasting error: {e}")
        raise HTTPException(status_code=500, detail="Demand forecasting failed")

# Fuel Fraud Detection Endpoints
@app.post("/ai/fuel/fraud-detection")
async def detect_fuel_fraud(fuel_data: Dict[str, Any]):
    """Detect potential fuel fraud"""
    try:
        fraud_analysis = await fuel_fraud_detector.analyze(fuel_data)
        return {
            "transaction_id": fuel_data.get("transaction_id"),
            "fraud_risk": fraud_analysis["fraud_risk"],
            "anomaly_score": fraud_analysis["anomaly_score"],
            "risk_factors": fraud_analysis["risk_factors"],
            "recommendation": fraud_analysis["recommendation"]
        }
    except Exception as e:
        logger.error(f"Fuel fraud detection error: {e}")
        raise HTTPException(status_code=500, detail="Fraud detection failed")

# Driver Scoring Endpoints
@app.post("/ai/drivers/score")
async def score_driver(driver_data: Dict[str, Any]):
    """Calculate driver performance score"""
    try:
        score = await driver_scorer.calculate_score(driver_data)
        return {
            "driver_id": driver_data.get("driver_id"),
            "overall_score": score["overall_score"],
            "safety_score": score["safety_score"],
            "efficiency_score": score["efficiency_score"],
            "fatigue_level": score["fatigue_level"],
            "recommendations": score["recommendations"]
        }
    except Exception as e:
        logger.error(f"Driver scoring error: {e}")
        raise HTTPException(status_code=500, detail="Driver scoring failed")

# Dynamic Pricing Endpoints
@app.post("/ai/pricing/calculate")
async def calculate_dynamic_price(pricing_data: Dict[str, Any]):
    """Calculate dynamic pricing for delivery"""
    try:
        price = await pricing_engine.calculate_price(pricing_data)
        return {
            "base_price": price["base_price"],
            "dynamic_price": price["dynamic_price"],
            "demand_multiplier": price["demand_multiplier"],
            "distance_factor": price["distance_factor"],
            "weight_factor": price["weight_factor"],
            "urgency_factor": price["urgency_factor"],
            "pricing_breakdown": price["breakdown"]
        }
    except Exception as e:
        logger.error(f"Dynamic pricing error: {e}")
        raise HTTPException(status_code=500, detail="Pricing calculation failed")

# Chatbot Endpoints
@app.post("/ai/chatbot/message")
async def process_chatbot_message(message_data: Dict[str, Any]):
    """Process chatbot message"""
    try:
        response = await chatbot.process_message(message_data)
        return {
            "response": response["text"],
            "intent": response["intent"],
            "confidence": response["confidence"],
            "actions": response.get("actions", []),
            "suggestions": response.get("suggestions", [])
        }
    except Exception as e:
        logger.error(f"Chatbot processing error: {e}")
        raise HTTPException(status_code=500, detail="Chatbot processing failed")

@app.post("/ai/chatbot/voice")
async def process_voice_message(audio_file: UploadFile = File(...)):
    """Process voice message"""
    try:
        # Save uploaded audio file
        audio_path = f"temp/{audio_file.filename}"
        with open(audio_path, "wb") as buffer:
            content = await audio_file.read()
            buffer.write(content)
        
        response = await chatbot.process_voice(audio_path)
        
        # Clean up temp file
        os.remove(audio_path)
        
        return {
            "transcription": response["transcription"],
            "response": response["text"],
            "intent": response["intent"],
            "confidence": response["confidence"]
        }
    except Exception as e:
        logger.error(f"Voice processing error: {e}")
        raise HTTPException(status_code=500, detail="Voice processing failed")

# Computer Vision Endpoints
@app.post("/ai/vision/cargo-verification")
async def verify_cargo(image_file: UploadFile = File(...)):
    """Verify cargo using computer vision"""
    try:
        # Save uploaded image
        image_path = f"temp/{image_file.filename}"
        with open(image_path, "wb") as buffer:
            content = await image_file.read()
            buffer.write(content)
        
        verification = await vision_model.verify_cargo(image_path)
        
        # Clean up temp file
        os.remove(image_path)
        
        return {
            "cargo_detected": verification["cargo_detected"],
            "cargo_type": verification["cargo_type"],
            "condition_score": verification["condition_score"],
            "damage_detected": verification["damage_detected"],
            "confidence": verification["confidence"],
            "bounding_boxes": verification["bounding_boxes"]
        }
    except Exception as e:
        logger.error(f"Cargo verification error: {e}")
        raise HTTPException(status_code=500, detail="Cargo verification failed")

@app.post("/ai/vision/pod-verification")
async def verify_pod(image_file: UploadFile = File(...)):
    """Verify proof of delivery using computer vision"""
    try:
        image_path = f"temp/{image_file.filename}"
        with open(image_path, "wb") as buffer:
            content = await image_file.read()
            buffer.write(content)
        
        verification = await vision_model.verify_pod(image_path)
        
        os.remove(image_path)
        
        return {
            "delivery_verified": verification["delivery_verified"],
            "signature_detected": verification["signature_detected"],
            "package_condition": verification["package_condition"],
            "location_verified": verification["location_verified"],
            "confidence": verification["confidence"]
        }
    except Exception as e:
        logger.error(f"POD verification error: {e}")
        raise HTTPException(status_code=500, detail="POD verification failed")

# Analytics Endpoints
@app.post("/ai/analytics/fleet-insights")
async def generate_fleet_insights(analytics_data: Dict[str, Any]):
    """Generate AI-powered fleet insights"""
    try:
        insights = await db_manager.generate_fleet_insights(analytics_data)
        return {
            "performance_trends": insights["performance_trends"],
            "cost_optimization": insights["cost_optimization"],
            "risk_assessment": insights["risk_assessment"],
            "recommendations": insights["recommendations"],
            "kpi_predictions": insights["kpi_predictions"]
        }
    except Exception as e:
        logger.error(f"Fleet insights error: {e}")
        raise HTTPException(status_code=500, detail="Fleet insights generation failed")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)