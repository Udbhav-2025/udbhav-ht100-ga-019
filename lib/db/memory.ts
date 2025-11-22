// In-memory database for development when MongoDB is unavailable

interface StoredCampaign {
  _id: string;
  websiteUrl: string;
  platforms: string[];
  tone: string;
  goal: string;
  status: string;
  brandResearch?: any;
  generatedContent?: any;
  generatedImages?: any;
  critique?: any;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  toObject?: () => any;
}

// Use global to persist across Next.js module reloads in dev mode
declare global {
  var __memoryDBCampaigns: Map<string, StoredCampaign> | undefined;
}

const campaigns: Map<string, StoredCampaign> = global.__memoryDBCampaigns || new Map();
if (!global.__memoryDBCampaigns) {
  global.__memoryDBCampaigns = campaigns;
}

// Helper to remove fields from object
const removeFields = (obj: any, fields: string[]): any => {
  const result = { ...obj };
  fields.forEach(field => {
    if (field.startsWith('-')) {
      delete result[field.substring(1)];
    }
  });
  return result;
};

export const memoryDB = {
  campaigns: {
    create: async (data: any): Promise<StoredCampaign> => {
      const id = Math.random().toString(36).substr(2, 9);
      console.log(`MemoryDB: Creating campaign with ID: ${id}`);
      const campaign: StoredCampaign = {
        _id: id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject: function () {
          const { toObject, ...rest } = this;
          return rest;
        },
      };
      campaigns.set(id, campaign);
      console.log(`MemoryDB: Campaign stored. Total campaigns: ${campaigns.size}`);
      return campaign;
    },

    findById: (id: string) => {
      console.log(`MemoryDB: findById called with ${id}`);
      console.log(`MemoryDB: All stored IDs:`, Array.from(campaigns.keys()));
      const campaign = campaigns.get(id);
      console.log(`MemoryDB: findById found? ${!!campaign}`);
      return {
        select: (fields: string) => ({
          lean: async () => {
            if (!campaign) return null;
            const fieldsToRemove = fields.split(' ').filter(f => f);
            const result = removeFields(campaign, fieldsToRemove);
            return result;
          },
        }),
        // Allow calling lean() directly without select()
        lean: async () => {
          if (!campaign) return null;
          const { toObject, ...rest } = campaign;
          return rest;
        },
      };
    },

    findByIdAndUpdate: async (id: string, data: any): Promise<StoredCampaign | null> => {
      const campaign = campaigns.get(id);
      if (!campaign) return null;
      const updated = { ...campaign, ...data, updatedAt: new Date() };
      campaigns.set(id, updated);
      return updated;
    },

    findByIdAndDelete: async (id: string): Promise<StoredCampaign | null> => {
      const campaign = campaigns.get(id);
      if (campaign) {
        campaigns.delete(id);
      }
      return campaign || null;
    },

    find: () => {
      console.log('MemoryDB: find called');
      console.log(`MemoryDB: Total campaigns in storage: ${campaigns.size}`);
      return {
        sort: (sortQuery: any) => {
          console.log('MemoryDB: sort called');
          return {
            limit: (n: number) => {
              console.log('MemoryDB: limit called');
              return {
                select: (fields: string) => {
                  console.log('MemoryDB: select called');
                  return {
                    lean: async () => {
                      console.log('MemoryDB: lean called');
                      const result = Array.from(campaigns.values())
                        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                        .slice(0, n)
                        .map(c => {
                          const fieldsToRemove = fields.split(' ').filter(f => f);
                          return removeFields(c, fieldsToRemove);
                        });
                      console.log(`MemoryDB: Returning ${result.length} campaigns`);
                      return result;
                    },
                  };
                },
                // Allow calling lean() directly without select()
                lean: async () => {
                  console.log('MemoryDB: lean called (direct)');
                  const result = Array.from(campaigns.values())
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    .slice(0, n)
                    .map(c => {
                      const { toObject, ...rest } = c;
                      return rest;
                    });
                  console.log(`MemoryDB: Returning ${result.length} campaigns`);
                  return result;
                },
              };
            },
            // Allow calling lean() directly without limit()
            lean: async () => {
              console.log('MemoryDB: lean called (direct, no limit)');
              const result = Array.from(campaigns.values())
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map(c => {
                  const { toObject, ...rest } = c;
                  return rest;
                });
              console.log(`MemoryDB: Returning ${result.length} campaigns`);
              return result;
            },
          };
        },
        // Allow calling lean() directly without sort()
        lean: async () => {
          console.log('MemoryDB: lean called (direct, no sort)');
          const result = Array.from(campaigns.values()).map(c => {
            const { toObject, ...rest } = c;
            return rest;
          });
          console.log(`MemoryDB: Returning ${result.length} campaigns`);
          return result;
        },
      };
    },
    
    // Simple method to get all campaigns
    getAll: async () => {
      console.log('MemoryDB: getAll called');
      const result = Array.from(campaigns.values()).map(c => {
        const { toObject, ...rest } = c;
        return rest;
      });
      console.log(`MemoryDB: Returning ${result.length} campaigns from getAll`);
      return result;
    },
  },
};

export default memoryDB;
