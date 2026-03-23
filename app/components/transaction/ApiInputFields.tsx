import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/types/form-types";
import { useNetworks } from "@/context/networks-context";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { NetworkSearchSelect } from "@/components/ui/network-search-select";
import { Input } from "@/components/ui/input";
import PixelAvatar from "@/components/pixel-avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { HelpCircle } from "lucide-react";

interface ApiInputFieldsProps {
  form: UseFormReturn<FormData>;
}

export default function ApiInputFields({ form }: ApiInputFieldsProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const { networks, isLoading } = useNetworks();

  const handleTooltipToggle = (id: string) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="network"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Network</FormLabel>
            <FormControl>
              <NetworkSearchSelect
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  const selectedNetwork = networks.find(
                    (network) => network.value === value
                  );
                  if (selectedNetwork) {
                    form.setValue("chainId", selectedNetwork.chainId);
                  }
                }}
                networks={networks}
                disabled={isLoading}
              />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              The network on which the Safe is deployed
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="chainId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chain ID</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter Chain ID"
                readOnly
                {...field}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  field.onChange(value);
                  const selectedNetwork = networks.find(
                    (network) => network.chainId === value
                  );
                  if (selectedNetwork) {
                    form.setValue("network", selectedNetwork.value);
                  }
                }}
              />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              The blockchain ID (automatically updated when selecting a network)
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">Safe Address
              <Tooltip open={activeTooltip === "safe-address"}>
                <TooltipTrigger asChild>
                  <span 
                    className="cursor-pointer" 
                    onClick={() => handleTooltipToggle("safe-address")}
                    onMouseEnter={() => setActiveTooltip("safe-address")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                  <HelpCircle className="ml-1 w-4 h-4 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent 
                  className="pointer-events-none max-w-xs break-words p-2 rounded-md bg-black text-white dark:bg-white dark:text-black"
                  sideOffset={5}
                > 
                  <p>Your multisig address.</p>
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Safe address (0x...)"
                leftIcon={<PixelAvatar address={field.value} />}
                {...field}
                onChange={(e) => {
                  if (e.target.value === '') {
                    field.onChange('');
                  } else {
                    const address = e.target.value.match(/0x[a-fA-F0-9]{40}/)?.[0];
                    if (address) {
                      field.onChange(address);
                    } else {
                      field.onChange(e.target.value);
                    }
                  }
                }}
              />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              The address of the Safe from which to retrieve the transaction
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nonce"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">Nonce
              <Tooltip open={activeTooltip === "safe-nonce"}>
                <TooltipTrigger asChild>
                <span 
                    className="cursor-pointer" 
                    onClick={() => handleTooltipToggle("safe-nonce")}
                    onMouseEnter={() => setActiveTooltip("safe-nonce")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <HelpCircle className="ml-1 w-4 h-4 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent 
                  className="pointer-events-none max-w-xs break-words p-2 rounded-md bg-black text-white dark:bg-white dark:text-black"
                  sideOffset={5}
                > 
                  <p>The nonce of the transaction you want to validate.</p>
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter the transaction nonce"
                {...field} 
              />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              The nonce (sequence number) of the transaction to retrieve
            </p>
          </FormItem>
        )}
      />
    </div>
  );
}