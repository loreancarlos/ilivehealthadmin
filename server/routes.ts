import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  // Auth routes
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Simple password check (in a real app, use bcrypt for comparison)
      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Don't send the password to the client
      const { password: _, ...userWithoutPassword } = user;
      
      // Get professional or clinic info if applicable
      let professional = null;
      let clinic = null;
      
      if (user.role === 'professional') {
        professional = await storage.getProfessionalByUserId(user.id);
      } else if (user.role === 'clinic') {
        const clinics = await storage.getClinics();
        // This is a simplification; in a real app, you'd have a relation
        clinic = clinics[0];
      }
      
      return res.status(200).json({ 
        user: userWithoutPassword,
        professional,
        clinic 
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validationResult = insertUserSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Invalid user data', 
          errors: validationResult.error.errors 
        });
      }
      
      const { email, username } = req.body;
      
      // Check if user already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already in use' });
      }
      
      // Create user
      const user = await storage.createUser(req.body);
      
      // Don't send the password to the client
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get current authenticated user
  app.get('/api/auth/me', async (req: Request, res: Response) => {
    // In a real app, this would check the session/token
    // For now, just return a mock response
    const user = await storage.getUserByEmail("admin@ilivehealth.com");
    
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Don't send the password to the client
    const { password: _, ...userWithoutPassword } = user;
    
    // Get professional or clinic info if applicable
    let professional = null;
    let clinic = null;
    
    if (user.role === 'professional') {
      professional = await storage.getProfessionalByUserId(user.id);
    } else if (user.role === 'clinic') {
      const clinics = await storage.getClinics();
      // This is a simplification; in a real app, you'd have a relation
      clinic = clinics[0];
    }
    
    return res.status(200).json({ 
      user: userWithoutPassword,
      professional,
      clinic 
    });
  });
  
  // Professionals routes
  app.get('/api/professionals', async (_req: Request, res: Response) => {
    try {
      const professionals = await storage.getProfessionals();
      return res.status(200).json({ professionals });
    } catch (error) {
      console.error('Error fetching professionals:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.get('/api/professionals/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      
      const professional = await storage.getProfessional(id);
      
      if (!professional) {
        return res.status(404).json({ message: 'Professional not found' });
      }
      
      return res.status(200).json({ professional });
    } catch (error) {
      console.error('Error fetching professional:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Clinics routes
  app.get('/api/clinics', async (_req: Request, res: Response) => {
    try {
      const clinics = await storage.getClinics();
      return res.status(200).json({ clinics });
    } catch (error) {
      console.error('Error fetching clinics:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.get('/api/clinics/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      
      const clinic = await storage.getClinic(id);
      
      if (!clinic) {
        return res.status(404).json({ message: 'Clinic not found' });
      }
      
      return res.status(200).json({ clinic });
    } catch (error) {
      console.error('Error fetching clinic:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
