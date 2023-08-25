package version

import (
	"github.com/spf13/cobra"
)

// VersionCmd represents the version command
func VersionCmd() *cobra.Command {
	versionCmd := &cobra.Command{
		Use:   "version",
		Short: "Show Rill version",
		RunE: func(cmd *cobra.Command, args []string) error {
			root := cmd.Root()
			root.SetArgs([]string{"--version"})
			return root.Execute()
		},
	}

	return versionCmd
}
