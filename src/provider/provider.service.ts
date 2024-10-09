import { Injectable } from '@nestjs/common';
import { ModelType } from 'src/prompt/prompt.dto';
import { Provider } from './provider.dto';

@Injectable()
export class ProviderService {
  // Maps provider ID to a Provider instance
  private providerMap: Map<string, Provider> = new Map();

  // Maps model type to an array of provider IDs
  private modelProviderMap: Map<ModelType, string[]> = new Map();

  // Registers a provider
  registerProvider(provider: Provider) {
    this.providerMap.set(provider.id, provider);

    // Get the current array of provider IDs for this model
    let providerIds = this.modelProviderMap.get(provider.model);
    if (!providerIds) {
      // Initialize if no providers for this model type exist yet
      providerIds = [];
      this.modelProviderMap.set(provider.model, providerIds);
    }
    // Check if the provider ID already exists in the model's provider array
    if (!providerIds.includes(provider.id)) {
      providerIds.push(provider.id);
    }
  }

  // Deregisters a provider by providerId
  deregisterProvider(providerId: string) {
    // Get the provider from the provider map
    const provider = this.providerMap.get(providerId);
    if (!provider) {
      throw new Error(`Provider with ID ${providerId} not found`);
    }

    // Remove the provider from provider map
    this.providerMap.delete(providerId);

    // Get the array of provider IDs for the model
    const providerIds = this.modelProviderMap.get(provider.model);

    if (providerIds) {
      // Filter out the provider ID
      const updatedProviderIds = providerIds.filter((id) => id !== providerId);

      if (updatedProviderIds.length === 0) {
        // Remove the model entry if no more providers exist for this model
        this.modelProviderMap.delete(provider.model);
      } else {
        // Otherwise, update the model's provider ID array
        this.modelProviderMap.set(provider.model, updatedProviderIds);
      }
    }
  }

  findProvidersByModel(model: ModelType): Provider[] {
    // Get the list of provider IDs for the model
    const providerIds = this.modelProviderMap.get(model);

    if (!providerIds || providerIds.length === 0) {
      return []; // No providers found for this model
    }

    // Retrieve the Provider instances from providerMap
    return providerIds
      .map((id) => this.providerMap.get(id))
      .filter((provider): provider is Provider => provider !== undefined);
  }
}