"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, ExternalLink } from "lucide-react"
import type { LicenseTerms } from "@/lib/story/types"
import { Button } from "@/components/ui/button"

interface LicenseTermsProps {
  licenseTerms: LicenseTerms[]
}

export function LicenseTermsDisplay({ licenseTerms }: LicenseTermsProps) {
  if (licenseTerms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>License Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No license terms attached to this IP asset.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {licenseTerms.map((terms, index) => (
        <Card key={terms.id.toString()}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>License Terms #{terms.id.toString()}</CardTitle>
              {terms.commercialUse ? (
                <Badge variant="default">Commercial</Badge>
              ) : (
                <Badge variant="secondary">Non-Commercial</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Usage Permissions */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Usage Permissions</h4>
              <div className="grid gap-2">
                <PermissionItem
                  label="Commercial Use"
                  allowed={terms.commercialUse}
                />
                <PermissionItem
                  label="Commercial Attribution Required"
                  allowed={terms.commercialAttribution}
                />
                <PermissionItem
                  label="Derivatives Allowed"
                  allowed={terms.derivativesAllowed}
                />
                <PermissionItem
                  label="Derivative Attribution Required"
                  allowed={terms.derivativesAttribution}
                />
                <PermissionItem
                  label="Derivative Approval Required"
                  allowed={terms.derivativesApproval}
                />
                <PermissionItem
                  label="Reciprocal Licensing"
                  allowed={terms.derivativesReciprocal}
                />
                <PermissionItem
                  label="Transferable"
                  allowed={terms.transferable}
                />
              </div>
            </div>

            {/* Fees & Revenue Share */}
            <div className="space-y-2 border-t pt-4">
              <h4 className="text-sm font-semibold">Fees & Revenue Share</h4>
              <div className="grid gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Minting Fee</span>
                  <span className="font-medium">
                    {terms.defaultMintingFee.toString()} wei
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Commercial Revenue Share
                  </span>
                  <span className="font-medium">{terms.commercialRevShare}%</span>
                </div>
                {terms.commercialRevCeiling > 0n && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Revenue Ceiling</span>
                    <span className="font-medium">
                      {terms.commercialRevCeiling.toString()}
                    </span>
                  </div>
                )}
                {terms.derivativeRevCeiling > 0n && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Derivative Revenue Ceiling
                    </span>
                    <span className="font-medium">
                      {terms.derivativeRevCeiling.toString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Expiration */}
            {terms.expiration > 0n && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Expiration</span>
                  <span className="font-medium">
                    {new Date(Number(terms.expiration) * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {/* URI */}
            {terms.uri && (
              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <a href={terms.uri} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    View Full License Terms
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function PermissionItem({ label, allowed }: { label: string; allowed: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
      <span className="text-sm">{label}</span>
      {allowed ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
    </div>
  )
}

